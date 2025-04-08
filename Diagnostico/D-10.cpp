#include <iostream>
using namespace std;
#include <string>
#include <vector>
#include <map>

enum class UserRole {
    Admin,
    Client,
    Seller,
    Warehouse
};

class User{
    private:
        string UserName;
        string Password;
        UserRole Role;
    public:
        User(string name, string pass, UserRole role) 
            : UserName(name), Password(pass), Role(role) {}
        string getUserName() const;
        string getPassword() const;
        UserRole getUserRole() const;

        void setUserName(string newName);
        void setPassword(string newPassword);
        void setRole(UserRole newuserRole);
};


string User::getUserName() const{
    return UserName;
}

string User::getPassword() const{
    return Password;
}

UserRole User::getUserRole() const{
    return Role;
}

void User::setUserName(string newName){
    User::UserName = newName;
}

void User::setPassword(string newPassword){
    User::Password = newPassword;
}

void User::setRole(UserRole newuserRole){
    Role = newuserRole;
}

class Article{
    private:
        string Tipe;
        double Price;
        int Stock;
    public:
        Article() : Tipe(""), Price(0.0), Stock(0) {}
        Article(string tipe, double price, int stock)
            : Tipe(tipe), Price(price), Stock(stock) {};
        
        string getTipe() const;
        double getPrice() const;
        int getStock() const;

        void setTipe(string newTipe);
        void setPrice(double newPrice);
        void setStock(int newStock);
};

string Article::getTipe() const{
    return Tipe;
}

double Article::getPrice() const{
    return Price;
}

int Article::getStock() const{
    return Stock;
}

void Article::setTipe(string newTipe){
    Tipe = newTipe;
}

void Article::setPrice(double newPrice){
    Price = newPrice;
}

void Article::setStock(int newStock){
    Stock = newStock;
}

class ArticlesManager{
    private:
        map <int, Article> articles;
        int nextId = 1;
    public:
        ArticlesManager();

        void addArticle(string tipe, double price, int stock);
        void removeArticle(int id);
        void showArticles();
        void editArticle(int id);
        void ArticlesMenu(ArticlesManager& articlesmanager, const string& userRole);
        void buyArticle(int id);
};

ArticlesManager::ArticlesManager() {
    articles[1] = Article("Lavandina x 1L", 875.25, 3000);
    articles[4] = Article("Detergente x 500mL", 1102.45, 2010);
    articles[22] = Article("Jabón en polvo x 250g", 650.22, 407);
    
    nextId = 23;
}

void ArticlesManager::addArticle(string tipe, double price, int stock){
    articles[nextId] = Article(tipe, price, stock);
    cout << "Article added with ID: " << nextId << endl;
    nextId++; 
};

void ArticlesManager::buyArticle(int id) {
    auto it = articles.find(id);
    
    if (it == articles.end()) {
        cout << "Error: No se encontro un articulo con el ID " << id << "." << endl;
        return;
    }

    Article& articulo = it->second;
    
    int cantidad;
    cout << "Ingrese la cantidad a comprar de '" << articulo.getTipe() << "': ";
    cin >> cantidad;

    if (cantidad <= 0) {
        cout << "Error: La cantidad debe ser mayor que 0." << endl;
        return;
    }

    if (cantidad > articulo.getStock()) {
        cout << "Error: Stock insuficiente. Solo quedan " << articulo.getStock() << " unidades disponibles." << endl;
        return;
    }

    articulo.setStock(articulo.getStock() - cantidad);
    cout << "Compra realizada con exito. Stock restante de '" << articulo.getTipe() << "': " << articulo.getStock() << endl;
}

void ArticlesManager::removeArticle(int id){
    if (articles.erase(id)){
            cout << "Article with ID " << id << " removed.\n";
        }else{
            cout << "Article with ID " << id << " not found.\n";
            }
};

void ArticlesManager::editArticle(int id) {
    auto it = articles.find(id);
    if (it == articles.end()) {
        cout << "Article with ID " << id << " not found.\n";
        return;
    }

    Article& article = it->second; //it es un operador de los maps que ayuda a acceder a la clave o el valor por separado, it->second accede al articulo, no a la id
    int option;
    bool repeat = true;

    while (repeat) {
        cout << "\nEditing Article ID: " << id << endl;
        cout << "1. Change Type (" << article.getTipe() << ")\n";
        cout << "2. Change Price ($" << article.getPrice() << ")\n";
        cout << "3. Change Stock (" << article.getStock() << ")\n";
        cout << "4. Exit Editing\n";
        cout << "Select an option: ";
        cin >> option;

        switch (option) {
            case 1: {
                string newType;
                cout << "Enter new type: ";
                cin.ignore();
                getline(cin, newType);
                article.setTipe(newType);
                cout << "Type updated successfully!\n";
                break;
            }
            case 2: {
                double newPrice;
                cout << "Enter new price: ";
                cin >> newPrice;
                article.setPrice(newPrice);
                cout << "Price updated successfully!\n";
                break;
            }
            case 3: {
                int newStock;
                cout << "Enter new stock: ";
                cin >> newStock;
                article.setStock(newStock);
                cout << "Stock updated successfully!\n";
                break;
            }
            case 4:
                repeat = false;
                cout << "Exiting edit mode.\n";
                break;
            default:
                cout << "Invalid option, try again.\n";
        }
    }
}

void ArticlesManager::showArticles(){
    if (articles.empty()) {
        cout << "No articles available.\n";
        return;
    }

    cout << "Articles List:\n";
    for (const auto& [id, article] : articles) {
        cout << "ID: " << id << ", Type: " << article.getTipe()
             << ", Price: $" << article.getPrice()
             << ", Stock: " << article.getStock() << endl;
    }
}

void ArticlesManager::ArticlesMenu(ArticlesManager& articlesmanager, const string& userRole) {
    int option;
    bool repeat = true;

    while(repeat){
        cout << "-----------------------" << endl;
        cout << "1. Show Articles" << endl;
        cout << "2. Add Article" << endl;
        cout << "3. Edit Article" << endl;
        cout << "4. Remove Article" << endl;
        cout << "5. Buy Article" << endl;
        cout << "6. Exit" << endl;
        cout << "-----------------------" << endl;
        cin >> option;

        string tipe;
        double price;
        int stock;
        int id;

        switch (option)
        {
            case 1:
                articlesmanager.showArticles();
                break;

            case 2:
                if (userRole == "Administrator" || userRole == "Warehouse") {
                    cout << "Enter Article Type: \n";
                    cin >> tipe;
                    cout << "Enter Article Price: \n";
                    cin >> price;
                    cout << "Enter Article Stock: \n";
                    cin >> stock;

                    articlesmanager.addArticle(tipe, price, stock);
                } else {
                    cout << "Access denied. You don't have permission to add articles.\n";
                }
                break;

            case 3:
                if (userRole == "Administrator" || userRole == "Warehouse") {
                    cout << "Enter Article Id: \n";
                    cin >> id;
                    articlesmanager.editArticle(id);
                } else {
                    cout << "Access denied. You don't have permission to edit articles.\n";
                }
                break;

            case 4:
                if (userRole == "Administrator" || userRole == "Warehouse") {
                    cout << "Enter Id of the Article you want to Remove: \n";
                    cin >> id;
                    articlesmanager.removeArticle(id);
                } else {
                    cout << "Access denied. You don't have permission to remove articles.\n";
                }
                break;

            case 5:
                if (userRole != "Warehouse") { // todos menos depósito pueden comprar
                    cout << "Enter Article Id: \n";
                    cin >> id;
                    articlesmanager.buyArticle(id);
                } else {
                    cout << "Access denied. You don't have permission to buy articles.\n";
                }
                break;

            case 6:
                repeat = false;
                break;

            default:
                cout << "Invalid option.\n";
                break;
        }
    }
}

class UserController{
    private:
    vector<User> users = {
        {"admin", "admin123", UserRole::Admin},
        {"cliente1", "cliente123", UserRole::Client},
        {"vendedor1", "venta123", UserRole::Seller},
        {"deposito1", "deposito123", UserRole::Warehouse}
    };
    public:
        int findUserIndex(const string& name);
        void login(const string& name, const string& password, int& failedAttempts);
        void Change_Password(const string& username);
        bool PasswordAuth(const string& password);
        void ReguisterUser(const string& username, const string& password, UserRole role);
        void crateUser();

        string UserRoletoString(UserRole userRole) const;
        UserRole getUserRole(int index) const;
        void ManageUsersMenu();
        void DeleteUser(const string& username);
};

string UserController::UserRoletoString(UserRole userRole) const{
    switch (userRole) {
        case UserRole::Admin: return "Admin";
        case UserRole::Client: return "Client";
        case UserRole::Seller: return "Seller";
        case UserRole::Warehouse: return "Warehouse";
        default: return "Unknown";
    }
}

UserRole UserController::getUserRole(int index) const {
    return users[index].getUserRole();
}
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

void UserController::crateUser() {
    string username, password;
    int rolInput;
    UserRole role;

    cout << "Enter username: ";
    cin >> username;

    cout << "Enter password: ";
    cin >> password;

    cout << "Select a role:\n";
    cout << "1. Administrator\n";
    cout << "2. Client\n";
    cout << "3. Seller\n";
    cout << "4. Warehouse worker\n";
    cout << "Role: ";
    cin >> rolInput;

    switch (rolInput) {
        case 1: role = UserRole::Admin; break;
        case 2: role = UserRole::Client; break;
        case 3: role = UserRole::Seller; break;
        case 4: role = UserRole::Warehouse; break;
        default:
            cout << " Invalid role. Registration cancelled.\n";
            return;
    }

    ReguisterUser(username, password, role);
}

void UserController::ReguisterUser(const string& username, const string& password, UserRole role) {
    if (findUserIndex(username) != -1) {
        cout << "Error: The username already exists. Please try another one.\n";
        return;
    }

    if (!PasswordAuth(password)) {
        cout << "Error: Registration failed due to an invalid password.\n";
        cout << "The password must be between 8 and 16 characters long.\n";
        cout << "The password must contain at least one uppercase letter and two special symbols.\n";
        return;
    }

    users.emplace_back(username, password, role);
    cout << "User successfully registered.\n";
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

void UserController::DeleteUser(const string& username) {
    int index = findUserIndex(username);
    if (index == -1) {
        cout << "User not found.\n";
        return;
    }

    users.erase(users.begin() + index);
    cout << "User deleted successfully.\n";
}

void UserController::ManageUsersMenu() {
    int option;
    string username, password;
    bool repeat = true;

    while (repeat) {
        cout << "\n--- User Management ---\n";
        cout << "1. Create User\n";
        cout << "2. Change Password\n";
        cout << "3. Delete User\n";
        cout << "4. Back\n";
        cout << "Choose an option: ";
        cin >> option;

        switch (option) {
            case 1:
                crateUser();
                break;
            case 2:
                cout << "Enter username to change password: ";
                cin >> username;
                Change_Password(username);
                break;
            case 3:
                cout << "Enter username to delete: ";
                cin >> username;
                DeleteUser(username);
                break;
            case 4:
                repeat = false;
                break;
            default:
                cout << "Invalid option\n";
        }
    }
}

void Menu(UserController& userController, const string& username, ArticlesManager& articlesmanager){
    int userIndex = userController.findUserIndex(username);
    if (userIndex == -1) {
        cout << "Error: Usuario no encontrado.\n";
        return;
    }

    string role =  userController.UserRoletoString(userController.getUserRole(userIndex));


    int select;
    bool repeat = true;

    while (repeat)
    {
        cout<<"------------------"<<endl;
        cout<<"1.Change Password"<<endl;
        cout<<"2.Manage Articles"<<endl;
        cout<<"3.Manage Users (admin only)"<<endl;
        cout<<"4.Exit"<<endl;
        cout<<"------------------"<<endl;
        cout << "Select an option: ";
        cin >> select;

        switch (select)
        {
        case 1:
                userController.Change_Password(username);
            break;
        case 2:
            articlesmanager.ArticlesMenu(articlesmanager, role);
            break;
        case 3:
            if (userController.getUserRole(userIndex) == UserRole::Admin) {
                userController.ManageUsersMenu();
            } else {
                cout << "Access denied: Only administrators can manage users.\n";
            }
        break;
            break;
        case 4:
            repeat = false;
            break;
        
        default:
            break;
        }
    }
    
}

void FirstMenu(UserController& userController, ArticlesManager& articlesmanager) {
    int option;
    bool repeat = true;

    while (repeat) {
        cout << "\n---------- MAIN MENU ----------\n";
        cout << "1. Login\n";
        cout << "2. Sing in\n";
        cout << "3. Exit\n";
        cout << "------------------------------------\n";
        cout << "Select an option: ";
        cin >> option;

        switch (option) {
            case 1: {
                string username, password;
                int failedAttempts = 0;

                while (failedAttempts < 3) {
                    cout << "User Name: ";
                    cin >> username;
                    cout << "Password: ";
                    cin >> password;

                    userController.login(username, password, failedAttempts);

                    if (failedAttempts == 0) {
                        Menu(userController, username, articlesmanager);
                        break;
                    }

                    if (failedAttempts >= 3) {
                        cout << "Usuario bloqueado. Contacte al administrador.\n";
                        break;
                    }
                }
                break;
            }

            case 2: {
                userController.crateUser();
                break;
            }

            case 3:
                repeat = false;
                cout << "Closing...\n";
                break;

            default:
                cout << "Invalid Option. Try Again\n";
        }
    }
}



int main() {
    UserController userController;
    ArticlesManager articlesmanager;

    FirstMenu(userController, articlesmanager);

    return 0;
}

