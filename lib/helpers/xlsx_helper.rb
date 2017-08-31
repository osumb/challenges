require 'rubyXL'
require 'securerandom'

# Spot Name Instrument Part name.# Role Email
module XLSXHelper
  # rubocop:disable Metrics/MethodLength
  def self.parse_users(file)
    users_worksheet = RubyXL::Parser.parse(file)[0]
    users = []
    i = 1
    until users_worksheet[i].nil?
      spread_sheet_row = users_worksheet[i]

      spot = spread_sheet_row[0] && spread_sheet_row[0].value
      full_name = spread_sheet_row[1].value
      instrument = spread_sheet_row[2].value
      part = spread_sheet_row[3].value.downcase
      buck_id = spread_sheet_row[4].value.downcase
      role = spread_sheet_row[5].value
      email = spread_sheet_row[6].value.downcase

      # Create spot
      if spot
        row = spot[0]
        file = spot[1..2].to_i
        db_spot = Spot.new(row: row, file: file)
      else
        db_spot = nil
      end

      first_name = full_name.split(' ')[0]
      last_name = last_name.split(' ')[1]
      user = User.new(
        first_name: first_name,
        last_name: last_name,
        instrument: User.instruments[instrument],
        part: User.parts[part],
        buck_id: buck_id,
        role: User.roles[role],
        password_digest: SecureRandom.base64(15),
        email: email,
        spot: db_spot
      )
      users << user
      i += 1
    end
    users
  end
end
