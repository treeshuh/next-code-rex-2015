package main

import (
       "fmt"
       "os"
       "io/ioutil"
       "regexp"
)

func main() {

    content, err := ioutil.ReadAll(os.Stdin)
    if err != nil {
        fmt.Println("Error while reading from stdin.")
    }
    line := string(content)

    // Replace identifiers with '?'
    ireg, _ := regexp.Compile("[A-Za-z0-9]+")
    line = ireg.ReplaceAllString(line,"?")

    // Remove all whitespace
    sreg, _ := regexp.Compile("\\s+")
    line = sreg.ReplaceAllString(line,"")

    fmt.Printf("%d\n",len(line))
}
