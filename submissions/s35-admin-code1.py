##### DO NOT CHANGE FUNCTION NAME #####
def sum_abs(a, b):
	return abs(identity(a))+abs(identity(b))
	
def identity(a):
    return a
import sys
if __name__ == "__main__":
	print(sum_abs(int(sys.argv[1].split(",")[0]), int(sys.argv[1].split(",")[1])))