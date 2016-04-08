# **Syntax system definition**

## **Structure:**

Structure of test definition is divided into blocks. [Blocks](#blocks) **starts with #**.

Blocks **[#Settings](#settings)** and **[#Given](#given)** are optional.

If **[#Test](#test)** block is not explicitly defined the whole input text would be processed as **[#Test](#test)** block.

Smallest building block of test definition is **command**.

Commands are defined as **one line** of text written in human language.

All commands have to come under strict rules defined by command template.

## **Blocks:**

### **#Settings**

*is used to define some general behavior for whole test*

##### commands list

* [Wait](#wait)



##### example
```
#Settings
Wait between operations for 0.5 s
```
### **#Given**

*is used for defining variables*

##### commands list

* [is](#is)

##### example
```
#Given
a is 1
b is 1.02
s is "abcdefg"
email is "[root@mail.com](mailto:root@mail.com)"
```
### **#Test**

*defines step instructions to be run as test*

Instructions have to be defined as list of steps written in the same order they have to be executed.



##### commands list

* [Click on](#click-on)

* [Double click on](#double-click-on)

* [Fill with](#fill-with)

* [should be](#should-be)

* [Wait for](#wait-for)

* [Move mouse to](#move-mouse-to)

* [Focus on](#focus-on)

* [Submit](#submit)

* [Press key](#press-key)

* [RadioGroup select](#radiogroup-select)

* [Dropdown select](#dropdown-select)

* [Property should be](#property-should-be)

* [Wait on response](#wait-on-response)

* [Check regex](#check-regex)

* [Test API](#test-api)

example
```
#Test
Title should be "Splat"
Click on "Sign Up" button
Fill placeholder "Username" with username
Fill input having id "email" with email
Fill placeholder "Password" with password
Fill placeholder "Enter Password Again" with password
Wait for 1 min
Click on element having id "signup-button"
```
## **Commands:**

### 	**#Settings commands list**

### 	**Wait**

##### 		usage
```
Wait <condition> for <number> [ms | s | min]
```
#####  		example
```
Wait between operations for 0.5 s
```
### **#Given commands list**

#### **is**

##### 	usage
```
<var> is <value>
```
##### example
```
a is 1
b is 1.02
s is "abcdefg"
email is "[root@mail.com](mailto:root@mail.com)"
```
### **#Test commands list**

#### **Click on**

*simulates click event on given* \<element\>

##### usage
```
click on <element>
```
##### example
```
click on "Sign Up" button
```
#### **Double click on**

*simulates double click event on given* \<element\>

##### usage
```
double click on <element>
```
##### example
```
double click on "About" link
```
#### **Fill with**

*sets value of input field to given* \<value\>

##### usage
```
fill <element> with <value>
```
##### example
```
fill placeholder "Username" with “John”
fill input having id "email" with email
```
#### **should be**

*asserts that two values are equal*

##### usage
```
<value> should be <value>
```
##### example
```
a should be 5
b should be 1.2
Title should be "Splat"
```

#### **Wait for**

*pause for given* \<number\> *of milliseconds / second / minutes*

##### usage

```
wait for <number> [ ms | s | min ]
```

##### example

```
wait for 1
```

#### **Move mouse to**

##### usage

```
move mouse to <element>
```

##### example

```
move mouse to link having id "menu-option-about"
```

#### **Focus on**

*sets focus on* \<element\>
##### usage

```
focus on <element>
```

##### example

```
focus on input having id "username-field"
```

#### **Submit**

*submits given* \<element\>
##### usage

```
submit <element>
```

##### example

```
submit form having id “user-login”
```

#### **Press key**
*simulates key press event*
##### usage
```
press key <key>
```
##### example
```
press key “Ctrl”
press key “A”
```

#### **RadioGroup select**
*selects an option from radio-button group*
##### usage
```
radiogroup <name> select <value>
```
##### example
```
radiogroup "switch" select "on"
radiogroup "switch" select "off"
```

### **Dropdown select**
*selects value from dropdown list*
##### usage
```
dropdown <name> select <value>
```
##### example
```
dropdown "fruits" select "apple"
dropdown "fruits" select "lemon"
```

### **Property should be**
*check if property of element has expected value*
##### usage
```
 <element> <property> property should be <value>
```
##### example
```
"button1" "value" property should be "Click me!"
"placeholder-image" "style" property should be "width:220px;height:280px;"
```

### **Wait on response**
*waits a* \<number\> *of milliseconds / second / minutes while all ajax requests return response*
##### usage
```
 wait on response <number> [ ms | s | min ]
```
##### example
```
 wait on response 500
```

### **Check regex**
*Check if value in* \<element\> *matches given* \<regex\>
##### usage
```
<element> check regex <regex>
```
##### example
```
"textBox1" check regex ":^[A-Z0-9+_.-]+@[A-Z0-9.-]+$"
```
### **Test API**
*Send GET, POST, PUT or DELETE request to specified* \<endpoint\> *and check response from it*
*parameters:*
- *should return - begin of check response block*
- *status - expected status code in response*
- *content-type - expected status content-type in response*
- *data - if specified after <should return> - expected JSON response, otherwise - JSON for request body*
- *save - save property from response*
*use save ALL_BODY for save all response body*
*for access to saved response props use a save variable*
*if in response expected an array, use variable saved[index] and dot notation for access to response props*
##### usage
```
<requestType> endpoint <endpoint> data <JSON> should return status <status code> content-type <content-type> data <JSON> dataProperty <value> save <property>
```
##### examples
```
#Given
moviesEndpoint is 'http://localhost:41484/movies'
#Test
post endpoint moviesEndpoint data "{'title':'CSI: Las Vegas','director':'J.Bruckheimer','released':2010-01-01}" should return status 500
get endpoint moviesEndpoint should return status 200 content-type "application/json; charset=utf-8" save ALL_BODY
get endpoint moviesEndpoint+'/'+saved[0]._id should return dataProperty "duration" 130
```

### **General commands list**

#### **Element selectors**

##### **having id**

**usage**

```
[<tag>|element] having id <value>
```

##### example

```
element having id "add-button"
input having id "username-field"
```

# **Example of test written in human language**
```
#Settings
wait between operations for 0.5 s
#Given
username is "root"
email is "[root@mail.com](mailto:root@mail.com)"
password is "Testroot1"
#Test
title should be "Splat"
click on "Sign Up" button
fill placeholder "Username" with username
fill input having id "email" with email
fill placeholder "Password" with password
fill placeholder "Enter Password Again" with password
wait for 1 min
click on element having id "singup-button"
```
