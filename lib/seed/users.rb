require 'rubyXL'

def seed_users
  users_worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'users.xlsx'))[0]
  users = []
  i = 1
  password_digest = BCrypt::Password.create('password')
  until users_worksheet[i].nil?
    row = users_worksheet[i]
    user_row = row[0] && row[0].value && row[0].value.downcase
    user_file = row[1] && row[1].value
    first_name = row[2].value
    last_name = row[3].value
    instrument = row[4].value.downcase
    part = row[5].value.downcase
    buck_id = row[6].value.downcase
    role = row[7].value.split(' ').join('').underscore
    email = row[9].value.downcase
    user = User.new(
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
    users << user
  end
  users
end
