require 'rubyXL'

def seed_challenges(performance)
  challenges_worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'challenges.xlsx'))[0]
  challenges = []
  i = 1
  while (challenges_worksheet[i] != nil) do
    row = challenges_worksheet[i]
    challenger_buck_id = row[0].value
    row_in_challenge = row[1].value[0].downcase
    file_in_challenge = row[1].value[1..-1]
    challenged_spot = Spot.where(row: row_in_challenge, file: file_in_challenge).first
    challenge = Challenge.new(challenge_type: :normal)
    challenge.performance = performance
    challenge.spot = challenged_spot
    challenge.stage = :done
    challenger = User.where(buck_id: challenger_buck_id).first
    winner_id = row[2].value
    challenger_comments = row[3].value
    challengee_comments = row[4].value
    challengee = User.where(spot: Spot.where(row: row_in_challenge, file: file_in_challenge)).first
    challenge.users = [challenger, challengee]
    challenge.user_challenges[0].spot = challenger.spot
    challenge.user_challenges[0].comments = challenger_comments
    challenge.user_challenges[0].place = winner_id == challenger.buck_id ? 1 : 2
    challenge.user_challenges[1].spot = challengee.spot
    challenge.user_challenges[1].comments = challengee_comments
    challenge.user_challenges[1].place = winner_id == challengee.buck_id ? 1 : 2
    challenges << challenge
    i += 1
  end
  challenges
end

def test_challenges

end
