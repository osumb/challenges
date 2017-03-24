require 'rubyXL'

def seed_disciplines(performance)
  worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'disciplines.xlsx'))[0]
  i = 1
  disciplines = []
  while !worksheet[i].nil?
    row = worksheet[i]
    buck_id = row[0].value
    reason = row[1].value
    open_spot = row[2].value
    allowed_to_challenge = row[3].value
    user = User.find_by buck_id: buck_id
    d = Discipline.new(
      reason: reason,
      user: user,
      performance: performance,
      open_spot: open_spot,
      allowed_to_challenge: allowed_to_challenge
    )
    disciplines << d
    i += 1
  end
  disciplines
end
