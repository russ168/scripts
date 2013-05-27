'''
 * Build Date: 2013-03-18 
 * Author: Dong, Aihua <dongaihua1201@nhn.com>
'''
from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm
import os
import json
from pprint import pprint
import glob
from pprint import pprint
 
def test():
    env.roledefs = {
        'master': ['10.96.250.211', '10.96.250.212', '10.96.250.213'],
        'data': ['10.96.250.216', '10.96.250.217', '10.96.250.218', '10.96.250.219', '10.96.250.220', '10.96.250.221', '10.96.250.222', '10.96.250.223', '10.96.250.224', '10.96.250.225', '10.96.250.226', '10.96.250.227', '10.96.250.228', '10.96.250.229', '10.96.250.230'],
        'search':['10.96.250.214', '10.96.250.215']
    }
    env.user = 'irteam'
    env.hosts = env.roledefs['master'] + env.roledefs['data'] + env.roledefs['search']
    env.data_path = os.path.abspath('/data2/es-data')
    env.cluster_name = 'es-test2-zookeeper-20-4'
    env.src = os.path.abspath(env.data_path + '/' + env.cluster_name)
    env.dest = os.path.abspath('/data3/es-data/')
    env.recover_src = os.path.abspath('/data3/es-data/' + env.cluster_name)
    env.recover_dest = os.path.abspath('/data2/es-data')
 
def prod():
    env.roledefs = {
        'master': ['10.96.250.211', '10.96.250.212', '10.96.250.213'],
        'data': ['10.96.250.221']
    }
    env.user = 'irteam'
    env.hosts = env.roledefs['master'] + env.roledefs['data']
    env.data_path = os.path.abspath('/data2/es-data')
    env.cluster_name = 'backup-test-0.20.0'
    env.src = os.path.abspath(env.data_path + '/' + env.cluster_name)
    env.dest = os.path.abspath('/data3/es-data/')
    env.recover_src = os.path.abspath('/data3/es-data/' + env.cluster_name)
    env.recover_dest = os.path.abspath('/data2/es-data')
    
@parallel    
@roles('master')
def backupMasterNodes(src='', dest=''):
    doBackup('master', src if src else env.src, dest if dest else env.dest)
 
@parallel    
@roles('data')
def backupDataNodes(src='', dest= ''):
    doBackup('data', src if src else env.src, dest if dest else env.dest)
 
@parallel
def recover(src='', dest= ''):
    doBackup('recover', src if src else env.recover_src, dest if dest else env.recover_dest)
    
def doBackup(role, src, dest):
    with cd("~/apps/"):
        put('./backupES.py', '~/apps/')
        run('mkdir -p ' + dest)
        run('python backupES.py ' + role + ' ' + src + ' ' + dest)

def ps():
    run("ps -ef|grep elas")
 
def check():
    run("du -sh " + env.dest)

