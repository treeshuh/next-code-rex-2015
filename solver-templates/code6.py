def make_change(c):
	return c/25+c%25/10+c%25%10/5+c%25%10%5

import sys
if __name__ == "__main__":
	print(make_change(int(sys.argv[1])))