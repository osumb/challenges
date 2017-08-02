json.challenges do
  json.array! @evaluable_challenges.each do |challenge|
    json.partial! 'challenges/challenge_for_evaluation', challenge: challenge
  end
end
