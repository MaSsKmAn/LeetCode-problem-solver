#include <iostream>
#include <string>
#include <vector>

bool isPalindrome(int x) {
    if (x < 0) return false;
    int original = x, reversed = 0;
    while (x > 0) {
        int digit = x % 10;
        reversed = reversed * 10 + digit;
        x /= 10;
    }
    return original == reversed;
}

int main() {
    std::string input;
    std::vector<int> nums;

    while (std::getline(std::cin, input) && !input.empty()) {
        nums.push_back(std::stoi(input));  
    }

    for (int num : nums) {
        if (isPalindrome(num)) {
            std::cout << num << " is a palindrome." << std::endl;
        } else {
            std::cout << num << " is not a palindrome." << std::endl;
        }
    }

    return 0;
}
