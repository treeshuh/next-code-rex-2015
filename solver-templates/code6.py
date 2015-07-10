def make_change(c):
	return int(c/25)+int(c%25/10)+int(c%25%10/5)+int(c%25%10%5)

import sys
if __name__ == "__main__":
	print(make_change(int(sys.argv[1])))