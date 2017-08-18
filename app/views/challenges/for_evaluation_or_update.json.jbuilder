json.challenges do
  json.array! @challenges.each do |challenge|
    json.partial! 'challenges/challenge_for_evaluation_or_update', challenge: challenge
  end
end
