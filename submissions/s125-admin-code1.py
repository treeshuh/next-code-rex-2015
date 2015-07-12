# DO NOT CHANGE FUNCTION NAME #
def sum_abs(a, b):
	return abs(a)+abs(b)
import sys
if __name__ == "__main__":
	print(sum_abs(int(sys.argv[1].split(",")[0]), int(sys.argv[1].split(",")[1])))