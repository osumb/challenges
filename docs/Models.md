# Models

## When a user makes a challenges
Eligibility will be checked first. Then a new row of the challenger table will be added. The row will have a reference
to the performance for which the challenge is, a reference to the 'challenger' (the person who made the challenge), and
a reference to the spot that the user is challenging. If the spot isn't open, then the corresponding spot will be marked
challenged. If the spot if open and this is the second challenger referencing the spot, we'll also mark it challenged.
Else, we'll leave it marked unchallenged.

## Once all the challenges are approved (by an admin)
We'll start populating the results table. Each spotId will have a corresponding results row for each performance. Each result row will have a reference to the
corresponding spot, and a reference to each member in the challenge. No comments will be generated yet and it will be
marked as pending.

## After the challenge
The squad leaders will populate the results table with comments for both challengers and a suggested winner. At this point,
the results will still be pending. Admins will have the ability to make modifications to each result. Once the challenges
are confirmed, the results will be processed. The results will be marked as not pending and some spot switches might have to happen.
For each result, the winner will get the result's SpotId. Then the previous holder of the result's SpotId will get the winner's
old spot. For possible challenge scenarios, see the [Challenge Logic](ChallengeLogic.md).

## What goes on the User Profile Page
The profile page will have each result that the user has been in. For each challenge, they'll see which performance it was
for, whether they won or lost, who they faced, and their own comments.

__NOTE: At most steps in the challenge process, admin's will have the opportunity to change basically anything__
