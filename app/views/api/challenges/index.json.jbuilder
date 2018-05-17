json.challenges do
  json.array! @challenges.each do |challenge|
    json.partial! 'api/challenges/challenge', challenge: challenge
  end
end
