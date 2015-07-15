def is_prime(n):
	return sum([n%i==0 for i in range(1,n)])==1

import sys
if __name__ == "__main__":
	print(is_prime(int(sys.argv[1])))