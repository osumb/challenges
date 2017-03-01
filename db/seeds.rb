require 'rubyXL'

past_performance = Performance.create!(
  name: 'Indiana Game',
  date: Time.zone.now - 3.days,
  window_open: Time.zone.now - 1.day,
  window_close: Time.zone.now - 1.day + 3.hours
)

current_performance = Performance.create!(
  name: 'Oklahoma Game',
  date: Time.zone.now + 2.days,
  window_open: Time.zone.now,
  window_close: Time.zone.now + 3.hours
)

puts "Added Performance"

spots_worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'spots.xlsx'))[0]
i = 1
while (spots_worksheet[i] != nil) do
  row = spots_worksheet[i]
  s = Spot.create!(row: Spot.rows[row[0].value.downcase], file: row[1].value)
  i += 1
end

puts "Added #{Spot.count} spots"

users_worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'users.xlsx'))[0]
i = 1
password_digest = BCrypt::Password.create('password')
while (users_worksheet[i] != nil) do
  row = users_worksheet[i]
  user_row = row[0] && row[0].value && row[0].value.downcase
  user_file = row[1] && row[1].value
  first_name = row[2].value
  last_name = row[3].value
  instrument = row[4].value.downcase
  part = row[5].value.downcase
  buck_id = row[6].value.downcase
  role = row[7].value.split(' ').join('').underscore
  password = row[8].value.downcase
  email = row[9].value.downcase
  user = User.create!(
    first_name: first_name,
    last_name: last_name,
    instrument: User.instruments[instrument],
    part: User.parts[part],
    buck_id: buck_id,
    role: User.roles[role],
    password_digest: password_digest,
    email: email,
    spot: Spot.where(row: Spot.rows[user_row], file: user_file)[0]
  )
  i += 1
end

puts "Added #{User.count} users"

challenges_worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'challenges.xlsx'))[0]
i = 1
while (challenges_worksheet[i] != nil) do
  row = challenges_worksheet[i]
  challenger_buck_id = row[0].value
  row_in_challenge = row[1].value[0].downcase
  file_in_challenge = row[1].value[1..-1]
  challenged_spot = Spot.where(row: row_in_challenge, file: file_in_challenge).first
  challenge = Challenge.new(challenge_type: :normal)
  challenge.performance = past_performance
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
  challenge.user_challenges[1].spot = challengee.spot
  challenge.user_challenges[1].comments = challengee_comments
  challenge.winner = winner_id == challenger.buck_id ? challenger : challengee
  challenge.save
  i += 1
end

puts "Added #{Challenge.count} challenges"
