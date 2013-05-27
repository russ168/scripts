ld Date: 2013-03-18 
 * Author: Dong, Aihua <dongaihua1201@nhn.com>
'''
#!/usr/bin/python
import os
import sys
import json
from pprint import pprint
import glob
import subprocess
 
role = sys.argv[1]
source_dir = os.path.abspath(sys.argv[2])
dest_dir = os.path.abspath(sys.argv[3])
exclude_file = 'excludes.txt'         
indices_dir = os.path.abspath(source_dir + '/nodes/0/indices')
 
def find_excludes():
    with open(exclude_file, 'w') as f:
        exclude_list = []
        for index in os.listdir(indices_dir):
            index_dir = indices_dir+'/'+index
            print index_dir
            for shard in os.listdir(index_dir):
                shard_dir = index_dir + "/" + shard
                print shard_dir
                try:
                    file = glob.glob(shard_dir+'/_state/state*')[0]
                    print file
                    with open(file) as data_file:    
                        data = json.load(data_file)
                        if data['primary']: 
                            pass
                        else:
                            exclude_list.append(index+"/"+shard)
                            f.write(index+"/"+shard)
                            f.write("\n")
                except:
                    pass
        pprint(exclude_list)
 
def backupMaster():
     print "Starting backup master..."
     os.system("rsync -av " + source_dir + " " + dest_dir)
 
def backupData():
    print "Starting backup data..."
    find_excludes()
    os.system("rsync -av " + source_dir + " " + dest_dir + " --exclude-from " + exclude_file)
        
def recover():
    print "Staring to recover..."
    os.system("rsync -av " + source_dir + " " + dest_dir)
 
if(role == 'master'):
    backupMaster()
elif(role == 'data'):
    backupData()
else:
    recover()
     
