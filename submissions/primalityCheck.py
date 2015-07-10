##### DO NOT CHANGE THE NAME OF THIS FUNCTION #####
def is_prime(n):
	if n == 1:
		return False
	for i in range(2, n):
		if n%i == 0:
			return False
	return True

##### DO NOT EDIT BELOW THIS LINE #####
import sys
if __name__ == "__main__":
	print(is_prime(int(sys.argv[1])))

##### THIS CODE DOES AFFECT YOUR CHARACTER COUNT #####