-- Things we need to check before for making a challenge
-- 1) Check if the user hasn't already made a challenge for the current performance (and is elligible)
-- 2) Check for availability of the spot (if spotChallenged count is less than full)
-- If those two checks pass, we'll make the challenge
-- 1) Create the row into the challenge table
-- 2) Increment the spotChallenged count for the spot we're challenging
-- 3) If the spot is full, we'll create a row in the results table
-- We'll consider breaking this up into functions
START TRANSACTION;

END;
