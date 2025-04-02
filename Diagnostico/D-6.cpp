#include <iostream>
using namespace std;
#include <string>
#include <vector>
#include <map>

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
        void ArticlesMenu(ArticlesManager& articlesmanager);
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

void ArticlesManager::ArticlesMenu(ArticlesManager& articlesmanager){
    int option;
    bool repeat = true;

    while(repeat){
        cout<<"-----------------------"<<endl;
        cout<<"1. Show Articles"<<endl;
        cout<<"2. Add Article"<<endl;
        cout<<"3. Edit Article"<<endl;
        cout<<"4. Remove Article"<<endl;
        cout<<"5. Exit"<<endl;
        cout<<"-----------------------"<<endl;
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
                cout << "Enter Article Type: \n";
                cin >> tipe;
                cout << "Enter Article Price: \n";
                cin >> price;
                cout << "Enter Article Stock: \n";
                cin >> stock;

                articlesmanager.addArticle(tipe, price, stock);
                break;
            case 3:
                cout << "Enter Article Id: \n";
                cin >> id;

                articlesmanager.editArticle(id);
                break;
            case 4:
                cout<<"Enter Id of the Article you want to Remove: \n";
                cin >> id;

                articlesmanager.removeArticle(id);
                break;
            case 5:
                repeat = false;
                break;
            
            default:
                break;
        }
    }
}

class UserController{
    private:
        vector<User> users = { {"admin", "admin123"}, {"user1", "password1"}, {"user2", "password2"} };
    public:
        int findUserIndex(const string& name);
        void login(const string& name, const string& password, int& failedAttempts);
        void Change_Password(const string& username);
        bool PasswordAuth(const string& password);
        void ReguisterUser(const string& username, const string& password);
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

void UserController::ReguisterUser(const string& username, const string& password) {
    if (findUserIndex(username) != -1) {
        cout << "Error: El nombre de usuario ya existe. Intente con otro.\n";
        return;
    }

    if (!PasswordAuth(password)) {
        cout << "Error: No se pudo registrar la cuenta debido a una contraseña inválida.\n La contraseña debe tener entre 8 y 16 caracteres.\n La contraseña debe contener al menos una mayúscula y dos símbolos especiales.\n";
        return;
    }

    users.emplace_back(username, password);
    cout << "Usuario registrado con éxito.\n";
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

void Menu(UserController& userController, const string& username, ArticlesManager& articlesmanager){
    int select;
    bool repeat = true;

    while (repeat)
    {
        cout<<"------------------"<<endl;
        cout<<"1.Change Password"<<endl;
        cout<<"2.Manage Articles"<<endl;
        cout<<"3.Exit"<<endl;
        cout<<"------------------"<<endl;
        cout << "Select an option: ";
        cin >> select;

        switch (select)
        {
        case 1:
                userController.Change_Password(username);
            break;
        case 2:
            articlesmanager.ArticlesMenu(articlesmanager);
            break;
        case 3:
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
                string username, password;
                cout << "Enter User Name: ";
                cin >> username;
                cout << "Enter New Password: ";
                cin >> password;
                userController.ReguisterUser(username, password);
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

