class SpotService
  SPOT_REGEX = /\d+|\D+/.freeze

  def self.find(query:)
    row, file = query.scan(SPOT_REGEX)

    Spot.includes(:current_user).find_by(row: Spot.rows[row&.downcase], file: file.to_i)
  end
end
