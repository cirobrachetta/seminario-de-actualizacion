#include <iostream>
using namespace std;
#include <string>
#include <vector>

class User{
    private:
        string UserName;
        string Password;
    public:
        User(string name, string pass) : UserName(name), Password(pass) {}
        string getUserName();
        string getPassword();
        void setUserName(string newName);
        void setPassword(string newPassword);
};

string User::getUserName(){
    return UserName;
}

string User::getPassword(){
    return Password;
}

void User::setUserName(string newName){
    User::UserName = newName;
}

void User::setPassword(string newPassword){
    User::Password = newPassword;
}

class UserController{
    private:
        vector<User> users = { {"admin", "admin123"}, {"user1", "password1"}, {"user2", "password2"} };
    public:
        int findUserIndex(const string& name);
        void login(const string& name, const string& password, int& failedAttempts);
        void Change_Password(const string& username);
        bool PasswordAuth(const string& password);
};

int UserController::findUserIndex(const string& name){
    for (size_t i = 0; i < users.size(); ++i) {
            if (users[i].getUserName() == name) {
                return i;
            }
        }
        return -1;
}

void UserController::login(const string& name, const string& password, int& failedAttempts){
    int index = findUserIndex(name);
        
        if (index == -1 || users[index].getPassword() != password) {
            cout << "Incorrect User Name and/or Password" << endl;
            failedAttempts++;
            return;
        }

        cout << "\n\t\t\t¡Welcom " << name << "!" << endl;
        failedAttempts = 0;

}

bool UserController::PasswordAuth(const string& password) {
    if (password.length() < 8 || password.length() > 16) {
        cout << "Error: La contraseña debe tener entre 8 y 16 caracteres.\n";
        return false;
    }

    int specialCount = 0, uppercaseCount = 0;

    for (char c : password) {
        specialCount += ispunct(c);
        uppercaseCount += isupper(c);
    }

    bool isValid = (uppercaseCount > 0) && (specialCount >= 2);

    if (!isValid) {
        cout << "Error: La contraseña debe contener al menos una mayúscula y dos símbolos especiales.\n";
    }

    return isValid;
}

void UserController::Change_Password(const string& username) {
    int index = findUserIndex(username);
    if (index == -1) {
        cout << "User not found." << endl;
        return;
    }

    string currentPassword, newPassword;
    cout << "Enter Actual Password: ";
    cin >> currentPassword;

    if (currentPassword != users[index].getPassword()) {
        cout << "Incorrect Password" << endl;
        return;
    }

    cout << "Enter new password: ";
    cin >> newPassword;
    if(UserController::PasswordAuth(newPassword)){
        users[index].setPassword(newPassword);
        cout << "Password updated.\n" << endl;
    }
}

void Menu(UserController& userController, const string& username){
    int select;
    bool repeat = true;

    while (repeat)
    {
        cout<<"------------------"<<endl;
        cout<<"1.Change Password"<<endl;
        cout<<"2.Exit"<<endl;
        cout<<"------------------"<<endl;
        cin >> select;

        switch (select)
        {
        case 1:
                userController.Change_Password(username);
            break;
        case 2:
            repeat = false;
            break;
        
        default:
            break;
        }
    }
    
}

int main() {
    UserController userController;
    string username, password;
    int failedAttempts = 0;

    while (failedAttempts < 3) {
        cout << "User Name: ";
        cin >> username;
        cout << "Password: ";
        cin >> password;

        userController.login(username, password, failedAttempts);

        if (failedAttempts == 0) {
            Menu(userController, username);
            break;
        }

        if (failedAttempts >= 3) {
            cout << "Usuario bloqueado. Contacte al administrador." << endl;
            break;
        }
    }

    return 0;
}

