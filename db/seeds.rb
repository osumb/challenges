require 'rubyXL'
require_relative '../lib/seed/challenges'
require_relative '../lib/seed/discipline_actions'
require_relative '../lib/seed/performances'
require_relative '../lib/seed/spots'
require_relative '../lib/seed/users'

p = past_performance
p.save
current_performance.save
puts "Added #{Performance.count} performances"

seed_spots.each { |spot| spot.save }
puts "Added #{Spot.count} spots"

seed_users.each { |user| user.save }
puts "Added #{User.count} users"

seed_challenges(p).each { |challenge| challenge.save }
puts "Added #{Challenge.count} challenges"

seed_discipline_actions(p).each { |d| d.save }
puts "Added #{DisciplineAction.count} discipline actions"
