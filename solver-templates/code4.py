def next_value(A):
	return A[-1]+A[1]-A[0]

import sys
if __name__ == "__main__":
	print(next_value([int(s) for s in sys.argv[1].split(",")]))