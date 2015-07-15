package main

import (
       "fmt"
       "os"
       "io/ioutil"
       "regexp"
)

func countLiteral(s string) (int, string) {
    p, _ := regexp.Compile("(?s)((''').*?('''))|(\".*?\")|('[^']*?')")
    match := p.FindStringIndex(s)
    if match != nil {
        return match[1] - match[0], s[:match[0]] + s[match[1]:]
    }
    return 0, s
}

func main() {

    content, err := ioutil.ReadAll(os.Stdin)
    if err != nil {
        fmt.Println("Error while reading from stdin.")
    }
    source := string(content)

    // Remove wrapper
    wreg, _ := regexp.Compile("import sys.*|if \\_\\_.*|print.*")
    source = wreg.ReplaceAllString(source,"")

    // Remove main function 
    freg, _ := regexp.Compile("def\\s+[A-Za-z0-9_]+\\([A-Za-z0-9-\\,\\s]+\\):")
    source = freg.ReplaceAllString(source,"")

    // Remove all comments
    creg, _ := regexp.Compile("[#]+(.*)")
    source = creg.ReplaceAllString(source,"")

    charCount := 0

    for true {
        count, newstr := countLiteral(source)
        if count == 0 {
            break
        }
        charCount += count
        source = newstr    
    }

    // Replace identifiers with '?'
    ireg, _ := regexp.Compile("[A-Za-z0-9_]+")
    source = ireg.ReplaceAllString(source,"?")

    // Remove all whitespace
    sreg, _ := regexp.Compile("\\s+")
    source = sreg.ReplaceAllString(source,"")

    fmt.Printf("\n%d",len(source) + charCount)
}
