package main

import (
	"encoding/csv"
	"flag"
	"fmt"
	"os"
	"strings"
	"time"
)

// Store question-answer pairs
type quiz struct {
	question string
	answer   string
}

func main() {
	// Read a command line flag specifying the CSV with the questions.
	csvPath := flag.String("csv", "questions.csv", "CSV with questions")
	timeLimit := flag.Int("limit", 30, "The time limit in seconds.")
	flag.Parse()

	// Open the file from path.
	file, e := os.Open(*csvPath)
	if e != nil {
		// Handle any errors.
		errorExit(fmt.Sprintf("Failed to open csv file at %s", *csvPath))
	}

	// Read the file as a CSV.
	r := csv.NewReader(file)
	pairs, e := r.ReadAll()
	if e != nil {
		// Handle any errors.
		errorExit("File could not be parsed.")
	}
	// Create a timer for the quiz.
	timer := time.NewTimer(time.Duration(*timeLimit) * time.Second)
	// Process the resulting strings.
	quiz := parsePairs(pairs)

	score := 0
	// Iterate through each question.
	for index, problem := range quiz {
		fmt.Printf("Problem #%d: %s = ", index+1, problem.question)
		answerChan := make(chan string)
		go func() {
			var answer string
			fmt.Scanf("%s\n", &answer)
			answerChan <- answer
		}()

		select {
		case <-timer.C:
			fmt.Printf("\nYou scored %d out of %d correct!\n", score, len(quiz))
			return
		case answer := <-answerChan:
			if answer == problem.answer {
				fmt.Println("Correct!")
				score++
			} else {
				fmt.Println("Incorrect!")
			}
		}
	}
	fmt.Printf("You scored %d out of %d correct!\n", score, len(quiz))

}

// Convert strings taken from the CSV to quiz problems.
func parsePairs(pairs [][]string) []quiz {
	// Allocates space for problems depending on the number of string pairs.
	ret := make([]quiz, len(pairs))
	for i, pair := range pairs {
		ret[i] = quiz{
			question: pair[0],
			answer:   strings.TrimSpace(pair[1]),
		}
	}
	return ret
}

func errorExit(msg string) {
	fmt.Println(msg)
	os.Exit(1)
}
