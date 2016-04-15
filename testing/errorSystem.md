# **Errors classification**

## **Error cases**

* [Element not found](#element-not-found)

* [Unexpected value](#unexpected-value)

* [API errors](#api-errors)

## **Work with errors**

* [When Altester found an error](#when-altester-found-an-error)


#### **Element not found**

Emits when Altester can't find element on page. For example, if your command is

```
click on element with id 'ImNotExisting'
```

and element with this id attribute not present on page - Altester return error like this:

```
Failed!
At row: 13
Can't find element by selector: id imnotexist
```

*Note.* If you not specified the value for search only, without selector, Altester will try to search this element by text.

#### **Unexpected value**

Occurs, when found value, which is not equal to expected. For example, title on current page must be "Splat", so your command is:

```
title should be "Splat"
```

But when title on page is another, Altester emits error:

```
Failed!
At row: 1
Titles mismatch! Expected: 'Splat' Got 'Salat'
```

Another example - you expected that value of the field with id property "director" must contain the "m" letter. For check this, you can use the regular expressions. So you type:

```
director check regex "[m]"
```

If value of this field will be "Quentin Tarantino", test will fails:

```
Failed!
At row: 13
regexp /[m]/ test() returned false
```

Also, if you want to check some css property on element:

```
"content" "font-size" property should be "15px"
```

and it will mismatch than expected - Altester give you to know this:

```
Failed!
At row: 7
Unexpected css property font-size on element with id content. Expected: 15px Got 14px
```

#### **API errors**

Emits when executed requests returns wrong values (status code, data in response body or wrong content-type).
For example, specified endpoint on GET request must returned status 200 and content-type JSON:

```
#Given
moviesEndpoint is 'http://localhost:41484/movies'
#Test
get endpoint moviesEndpoint should return status 200 content-type "application/json; charset=utf-8"
```

If server not responding, test fails with error like this:

```
Failed!
At row: 4
Cannot read property 'statusCode' of undefined
```

It says that Altester can't read status property from response. But when server returns wrong response, error will be like this:

```
Failed!
At row: 4
Unexpected status code in response. Expected: 200 Got 500
```
Also, if you want to check some property, which expected in response body, but this property not exists:

```
post endpoint moviesEndpoint data CSI should return status 200 dataProperty "upserted[0].index" 0 save ALL_BODY
```

```
Failed!
At row: 12
Cannot read property '0' of undefined
```
#### **When Altester found an error**

When test completed successfully, Altester displays green colour status field with text "Success!OK" in bottom page.
But when test fails, this status field will be red colour. You can view details by clicking on "View details" or save results by clicking "Save results"
