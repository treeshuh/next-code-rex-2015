/* Client-side sanitation for Python code */

var libraries = [
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
    'toaiff',
    'sys'
]

var builtins = [
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


function check(source) {

    for (i in libraries) {
        p = new RegExp("import[\\s\\\\]+" + libraries[i]) // Checks for imports
        p2 = new RegExp("from[\\s\\\\]+" + libraries[i]) // Checks for: from os import system
        if (p.test(source) || p2.test(source)) {
            return [false, "Your program includes suspicious imports."]
        }
    }

    for (i in builtins) {
        p = new RegExp("[^\\.\\w\\d]" + builtins[i] + "[\\s\\\\]*\\(.*\\)") // Checks for open(), exec(), etc 
        p2 = new RegExp("=[\\s\\\\]*" + builtins[i] + "[\\s\\\\]") // Prevents aliasing: v = open
        if (p.test(source) || p2.test(source)) {
            return [false, "Your program includes a dangerous function call."]
        }

    }

    return [true, undefined]
}