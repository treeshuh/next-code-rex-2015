#####
def closest_palindrome(n):
	s=0
	while True:
		if str(n+s) == str(n+s)[::-1]:
			return n+s
		if str(n-s) == str(n-s)[::-1]:
			return n-s
		s+=1

import sys
if __name__ == "__main__":
	print(closest_palindrome(int(sys.argv[1])))