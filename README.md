# Life simulator

Ever wanted to fast-forward through your life to see how it all turns out?

I made this web page to do just that. 

To run your life simulation: 
 1. Enter your age
    - You can also check the box next to "I'd rather not say" and you'll get a random age from 0-100
 2. Press the "Run Simulation" button
    - This will give you an expected "death date" based on your current age
 3. Watch the time elapse until you expire
    - If it's passing too slow, you can speed time up by sliding the "Time Multiplier" slider (up to 500 Million times normal life speed!)

## Calculating death date

To calculate death date, I used the Social Security Administration's [actuarial life table](https://www.ssa.gov/oact/STATS/table4c6.html). 

For each age after your current age, I take the "death probability" from that table, then generate a random number from 0-1, and see if it is below the death probability. If it is, you die that year. Otherwise, you live to fight another year. 

If you're still alive past age 119, the max age of that table, first of all, congratulations! In that case you just get the death probability at age 119 for the rest of your years (it's a little bit of a gift since your death probability in reality would keep going down after that, but what's better than the gift of life?). 

I do not ask you to specify "male" or "female", so I take the average of the female and male death probabilities for each age. Since female's have a higher life expectancy, that means if you're male, you get a little extra probability of life, and if you're female, you get a little less (sorry). 

Finally, given current life expectancy limits, I kept the max age as 141. But I may update that in the future as the state of the art in medical life extension evolves.  

## Frontend

For the frontend I used [Vite](https://vitejs.dev/). Live site lives [here](https://life-simulator.numberthink.com).