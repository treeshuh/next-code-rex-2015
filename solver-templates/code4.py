def next_value(A):
	return A[len(A)-1]+A[1]-A[0]

import sys
if __name__ == "__main__":
	A = sys.argv[1].split(",")
	print(next_value([int(s) for s in A]))