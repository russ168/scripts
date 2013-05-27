#!/usr/bin/python
import sys  
import time
import socket
import signal,os
import threading
from datetime import datetime
import calendar

import thrift
from thrift.transport.TSocket import TSocket
from thrift.transport.TTransport import TFramedTransport
from thrift.transport.TTransport import TBufferedTransport
from thrift.transport.TTransport import TFileObjectTransport

from thrift.protocol import TBinaryProtocol
from nelo2 import ThriftNeloEventServer
from nelo2.ttypes import *

#prject define, your modify it's value according your requirement
#we have for collector,so each project log count should x4
prj_dict = {
  'nelo2-test-1m'    : 250000,         #1
  'nelo2-test-2m'    : 500000,         #2
  'nelo2-test-3m'    : 750000,         #3
  'nelo2-test-4m'    : 1000000,        #4
  'nelo2-test-5m'    : 1250000,        #5
  'nelo2-test-6m'    : 1500000,        #6
  'nelo2-test-7m'    : 1750000,        #7
  'nelo2-test-8m'    : 2000000,        #8
  'nelo2-test-9m'    : 2250000,        #9
  'nelo2-test-10m'   : 2500000,        #10
  'nelo2-test-11m'   : 2750000,        #11
  'nelo2-test-12m'   : 3000000,        #12
  'nelo2-test-13m'   : 3250000,        #13
  'nelo2-test-14m'   : 3500000,        #14
  'nelo2-test-15m'   : 3750000,        #15
  'nelo2-test-16m'   : 4000000,        #16
  'nelo2-test-17m'   : 4250000,        #17
  'nelo2-test-18m'   : 4500000,        #18
  'nelo2-test-19m'   : 4750000,        #19
  'nelo2-test-20m'   : 5000000,        #20
  'nelo2-test-21m'   : 5250000,        #21
  'nelo2-test-22m'   : 5500000,        #22
  'nelo2-test-23m'   : 5750000,        #23
  'nelo2-test-24m'   : 6000000,        #24
  'nelo2-test-25m'   : 6250000,        #25
  'nelo2-test-26m'   : 6500000,        #26
  'nelo2-test-27m'   : 6750000,        #27
  'nelo2-test-28m'   : 7000000,        #28
  'nelo2-test-29m'   : 7250000,        #29
  'nelo2-test-30m'   : 7500000,        #30
  'nelo2-test-50m'   : 12500000,       #31
  'nelo2-test-80m'   : 20000000,       #32
  'nelo2-test-100m'  : 25000000,       #33
  'nelo2-test-200m'  : 50000000        #34
}

server_dict = {
"10.96.250.211" : 10060,
"10.96.250.212" : 10060,
"10.96.250.213" : 10060,
"10.96.250.214" : 10060
}

#recording already send log number for each project
logCnt_dict = {}

#send thread pool
work_mutex = threading.Lock()
work_threads = []
work_numbers = 0

#server_ip = ''
#server_port = 0
file_name = ''

#TPS variant
tps_mutex = threading.Lock()
tps_dict1 = {}
tps_error = 0
tps_timer = 5
tps_begin = 0
tps_total = 0

#
def sig_exit():
    print "exited the system"
    sys.exit()

def handler(isig, frame):
    if isig == 2:
        sig_exit()
    if isig == 3:
        sig_exit()
    if isig == 9:
        sig_exit()
    return None

def tps_remember(err):
    global tps_dict1
    global tps_error
    global tps_mutex
    global tps_timer
    global tps_total
    try:
        tps_mutex.acquire()
        tps_total += 1
        tps_error += err
        if err == 0:
            key = int(time.time())
            key = key-key%tps_timer;
            if not tps_dict1.has_key(key):
                tps_dict1[key] = 0
            tps_dict1[key] = tps_dict1[key] + 1
    finally:
        tps_mutex.release()

class workThread(threading.Thread):
    def __init__(self, ip, port):
        threading.Thread.__init__(self)
        self.server_ip = ip
        self.server_port = port

    def run(self):
        global work_mutex
        global work_numbers
                
        err_local = 0
        try:
    	    socket = TSocket(self.server_ip, int(self.server_port))
            transport = TFramedTransport(socket)
            transport.open()
            protocol = TBinaryProtocol.TBinaryProtocol(transport)
            client = ThriftNeloEventServer.Client(protocol)   


            stop_flag = True
            while stop_flag:
    	        #read thrift from file
                f = file(file_name, 'r')
                fd_transport = TFileObjectTransport(f)
                buffered_transport = TBufferedTransport(fd_transport)
                binary_protocol = TBinaryProtocol.TBinaryProtocol(buffered_transport)
                fd_transport.open()
                stop_flag = False
                try:
                    evt = ThriftNeloEvent()
                    while True:
                        evt.read(binary_protocol)
				        #send the log to each project name
                        for prjName, logCnt in prj_dict.items():
                            try:
                                if logCnt_dict.has_key(prjName):
                                    if int(logCnt_dict[prjName]) < int(logCnt):
                                        evt.projectName = prjName
                                        evt.sendTime = int(time.time() * 1000)
                                        err = client.ackedAppend(evt)
                                        tps_remember(err)
                                        err_local += err
                                        logCnt_dict[prjName] = logCnt_dict[prjName] + 1
                                        stop_flag = True
                                else:
                                    evt.projectName = prjName
                                    err = client.ackedAppend(evt)
                                    tps_remember(err)
                                    err_local += err
                                    logCnt_dict[prjName] = 1
                                    stop_flag = True
                            except TException, msg:
                                print msg, prjName
                except EOFError,msg:
                    buffered_transport.close() #close the transport
                    stop_flag = True

            work_mutex.acquire()
            work_numbers -= 1
            work_mutex.release()
 
            socket.close()
        except TException, msg:
            print msg
            work_mutex.acquire()
            work_numbers -= 1
            work_mutex.release()
 
            socket.close()
	       
class tpsThread(threading.Thread):
    def run(sef):
        global tps_dict1
        global tps_error
        global tps_mutex
        global tps_timer
        global work_mutex
        global work_numbers

        tps_total = 0
        tps_index = 0
        left_thread = work_threads
        print 'Index  TPS(%ds)  TPS(All)  Error  Total' % (tps_timer)
        while 1:
            try:
                time.sleep(tps_timer)
                
                key = int(time.time())
                key = key-key%tps_timer
                key1= key - 3*tps_timer
                key2= key - 2*tps_timer
                key3= key - tps_timer
                
                tps_mutex.acquire()
                if tps_dict1.has_key(key1):
                    tps_index += 1
                    tps_total += tps_dict1[key1];
                    print '%4d,  %5d,  %5d,  %5d,  %5d' % (tps_index, int(tps_dict1[key1]/tps_timer), int(tps_total/(key - tps_begin)), tps_error, tps_total) 
                    del tps_dict1[key1]

                if tps_dict1.has_key(key2):
                    tps_index += 1
                    tps_total += tps_dict1[key2];
                    print '%4d,  %5d,  %5d,  %5d,  %5d' % (tps_index, int(tps_dict1[key2]/tps_timer), int(tps_total/(key - tps_begin)), tps_error, tps_total) 
                    del tps_dict1[key2]
                    
                if tps_dict1.has_key(key3):
                    tps_index += 1
                    tps_total += tps_dict1[key3];
                    print '%4d,  %5d,  %5d,  %5d,  %5d' % (tps_index, int(tps_dict1[key3]/tps_timer), int(tps_total/(key - tps_begin)), tps_error, tps_total)                     
                    del tps_dict1[key3]

            finally:
                tps_mutex.release()

            #all work thread is over
            work_mutex.acquire()
            left_thread = work_numbers;
            work_mutex.release()
            
            if left_thread == 0:
                print 'Test is finished, error number is: ', tps_error
                sys.exit(0)
        
#running enter here, check input command parameter
if len(sys.argv) != 2:
    print('method of use:\n'+sys.argv[0],'file name')
    sys.exit(1)

#read input parameter
#server_ip = sys.argv[1]
#server_port = int(sys.argv[2])
#messgeLength = int(sys.argv[3])
file_name = sys.argv[1]

#print 'server ip:', server_ip, ' sever port:', server_port, ' log file:', file_name


#installl signal hander for signal
signal.signal(signal.SIGINT,handler)
signal.signal(signal.SIGTERM,handler)
signal.signal(3,handler)
signal.signal(signal.SIGALRM, handler)

#create threads pool
tps_begin = time.time()
#for x in xrange(0, int(work_numbers)):
for ip, port in server_dict.items():
    print "create new thread, send to server: [", ip, ":", port, "]"
    tmp = workThread(ip, port)
    tmp.setDaemon(True)
    tmp.start()
    work_numbers = work_numbers + 1
    work_threads.append(tmp)

#create TPS thread
tps = tpsThread()
tps.setDaemon(True)
tps.start()
    
#wait for signal
signal.pause()
 
