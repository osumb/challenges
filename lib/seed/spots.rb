require 'rubyXL'

def seed_spots
  spots_worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'spots.xlsx'))[0]
  i = 1
  spots = []
  while !spots_worksheet[i].nil?
    row = spots_worksheet[i]
    s = Spot.new(row: Spot.rows[row[0].value.downcase], file: row[1].value)
    i += 1
    spots << s
  end
  spots
end
