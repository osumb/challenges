json.challenges do
  json.array! @challenges.each do |challenge|
    json.partial! 'challenges/challenge', challenge: challenge
  end
end
