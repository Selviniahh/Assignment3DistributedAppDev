# Github Link: 
https://github.com/Selviniahh/Assignment3DistributedAppDev

# URL of the project 
```angular2html
https://assignment3-distributed-app-1shttd6oa-kenans-projects-180eb90b.vercel.app
```

# Test Languages
```angular2html
https://assignment3-distributed-app-1shttd6oa-kenans-projects-180eb90b.vercel.app/api/languages
```

### Output you should get: 
```angular2html
message	"success"
data	
0	
language	"English"
1	
language	"German"
2	
language	"Turkish"
```

# Test timesOfDay
```angular2html
https://assignment3-distributed-app-1shttd6oa-kenans-projects-180eb90b.vercel.app/timesOfDay
```
### Output you should get
```angular2html
message	"success"
data	
0	
timeOfDay	"Evening"
1	
timeOfDay	"Afternoon"
2	
timeOfDay	"Morning"
```

# Test Greet
```
curl -X POST https://assignment3-distributed-app-1shttd6oa-kenans-projects-180eb90b.vercel.app/api/greet -H "Content-Type: application/json" -d '{"timeOfDay": "Evening", "language": "English", "tone": "Formal"}'
```
### Output you should get:
```
{"greetingMessage":"Good evening"}
```

# Test Console 
Navigate to **GreetingClient** 

call `dotnet build` then `dotnet run` type necessary texts and run the project.