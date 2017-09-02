require 'rubyXL'
require 'securerandom'

# Name	Instrument	Spot	Part	name.#	Email
module XLSXHelper
  def self.parse_users(file)
    users_worksheet = RubyXL::Parser.parse(file)[0]
    users = []
    i = 1
    until users_worksheet[i].nil?
      spread_sheet_user = parse_user_row(users_worksheet[i])
      users << user_from_spread_sheet_row(spread_sheet_user)
    end
    users
  end

  private

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def parse_user_row(row)
    {
      full_name: row[0] && row[0].value,
      instrument: row[1] && row[1].value,
      spot: row[2] && row[2].value,
      part: row[3] && row[3].value,
      buck_id: row[4] && row[4].value,
      email: row[5] && row[5].value,
      role: row[6] && row[6].value
    }
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

  # rubocop:disable Metrics/MethodLength
  def user_from_spread_sheet_row(row)
    password_digest = SecureRandom.base64(15)
    spot = row[:spot] && Spot.create(
      row: row[:spot].split(' ').join[0].downcase,
      file: row[:spot].split(' ').join[1..2].to_i
    )
    user = User.create(
      first_name: row[:full_name].split(' '),
      last_name: row[:full_name].split(' '),
      spot: spot,
      instrument: row[:instrument],
      part: User.parts[row[:part]],
      buck_id: row[:buck_id],
      role: User.roles[row[:role]],
      password_digest: password_digest,
      email: row[:email]
    )
    [user, password_digest]
  end
  # rubocop:enable Metrics/MethodLength
end
