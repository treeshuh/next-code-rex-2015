def is_prime(n):
	if n == 1:
		return False
	for i in range(2, n):
		if n%i == 0:
			return False
	return True

import sys
if __name__ == "__main__":
	print(is_prime(int(sys.argv[1])))