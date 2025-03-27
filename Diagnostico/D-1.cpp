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
            failedAttempts++;  // Incrementamos los intentos fallidos
            return;
        }

        cout << "\n\t\t\t¡Welcom " << name << "!" << endl;
        failedAttempts = 0;  // Reiniciamos los intentos fallidos al iniciar sesión con éxito

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
            break;  // Si el login fue exitoso, terminamos el bucle
        }

        if (failedAttempts >= 3) {
            cout << "Usuario bloqueado. Contacte al administrador." << endl;
            break;
        }
    }

    return 0;
}

