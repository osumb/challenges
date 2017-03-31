require 'rubyXL'

def seed_discipline_actions(performance)
  worksheet = RubyXL::Parser.parse(Rails.root.join('lib', 'seed', 'discipline_actions.xlsx'))[0]
  i = 1
  discipline_actions = []
  while !worksheet[i].nil?
    row = worksheet[i]
    buck_id = row[0].value
    reason = row[1].value
    open_spot = row[2].value
    allowed_to_challenge = row[3].value
    user = User.find_by buck_id: buck_id
    d = DisciplineAction.new(
      reason: reason,
      user: user,
      performance: performance,
      open_spot: open_spot,
      allowed_to_challenge: allowed_to_challenge
    )
    discipline_actions << d
    i += 1
  end
  discipline_actions
end
