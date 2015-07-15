# This program checks for dangerous imports and builtin functions

import sys, re

libraries = [
'compile',
'subprocess',
'fileinput',
'tempfile',
'filecmp',
'linecache',
'dircache',
'shutil',
'shelve',
'marshal',
'anydbm',
'whichdb',
'dbm',
'gdbm',
'dbhash',
'bsddb',
'dumbdbm',
'sqlite3',
'zlib',
'gzip',
'bz2',
'zipfile',
'tarfile',
'onfigParser',
'robotparser',
'netrc',
'xdrlib',
'plistlib',
'os',
'io',
'logging',
'platform',
'select',
'multiprocessing',
'mmap',
'readline',
'rlcompleter',
'socket',
'ssl',
'signal',
'popen2',
'asyncore',
'asynchat',
'email',
'mailbox',
'MimeWriter',
'multifile',
'webbrowser',
'cgi',
'cgitb',
'wsgiref',
'urllib',
'urllib2',
'httplib',
'ftplib',
'poplib',
'impalib',
'nntplib',
'smtplib',
'smtpd',
'telnetlib',
'uuid',
'urlparse',
'SocketServer',
'BaseHTTPServer',
'SimpleHTTPServer',
'CGIHTTPServer',
'cookielib',
'Cookie',
'xmlrpclib',
'SimpleXMLRPCServer',
'DocXMLRPCServer',
'audioop',
'imageop',
'aifc',
'sunau',
'wave',
'chunk',
'colorsys',
'imghdr',
'sndhdr',
'ossaudiodev',
'gettext',
'cmd',
'sysconfig',
'rexec',
'Bastion',
'imp',
'importlib',
'imputil',
'zipimport',
'pkgutil',
'modulefinder',
'runpy',
'compileall',
'py_compile',
'msilib',
'msvcrt',
'posix',
'pwd',
'spwd',
'grp',
'crypt',
'dl',
'termios',
'tty',
'pty',
'fcntl',
'pipes',
'posixfile',
'resource',
'nis',
'syslog',
'commands',
'ic',
'MacOS',
'macostools',
'findertools',
'EasyDialogs',
'FrameWork',
'autoGIL',
'imgfile',
'jpeg',
'hooks',
'ntpath',
'posixpath',
'bsddb185',
'linuxaudiodev',
'toaiff']

builtins = [
'open',
'exec',
'eval',
'execfile',
'__import__',
'__builtins__',
'__class__',
'__bases__',
'__subclasses__',
]


def check(source):
    output = []
    for library in libraries:
        p = re.compile('import[\\s\\\\]+' + library) # Checks for imports
        p2 = re.compile('from[\\s\\\\]+' + library) # Checks for: from os import system 
        m = p.search(source)
        m2 = p2.search(source)
        if m:
            output.append('Suspicious import: %s' % m.group())
        if m2:
            output.append('Suspicious import: %s' % m2.group())


    for builtin in builtins:
        p = re.compile('([^\\.\w\d]|\A)' + builtin + '[\\s\\\\]*\\(.*\\)') # Checks for open(), exec(), etc 
        p2 = re.compile('=[\\s\\\\]*' + builtin + '([\\s\\\\]|\Z)') # Prevents aliasing: v = open
        m = p.search(source)
        m2 = p2.search(source)
        if m:
            output.append('Dangerous function call: %s' % m.group())
        if m2:
            output.append('Dangerous function aliased: %s' % m2.group())
    return output

sourcefile = sys.stdin.read()

output = check(sourcefile)
if output:
    print '\n'.join(output)

