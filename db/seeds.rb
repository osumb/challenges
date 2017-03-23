require 'rubyXL'
require_relative '../lib/seed/challenges'
require_relative '../lib/seed/disciplines'
require_relative '../lib/seed/performances'
require_relative '../lib/seed/spots'
require_relative '../lib/seed/users'

past_performance.save
current_performance.save
puts "Added #{Performance.count} performances"

seed_spots.each { |spot| spot.save }
puts "Added #{Spot.count} spots"

seed_users.each { |user| user.save }
puts "Added #{User.count} users"

seed_challenges.each { |challenge| challenge.save }
puts "Added #{Challenge.count} challenges"

seed_disciplines.each { |discipline| discipline.save }
puts "Added #{Discipline.count} disciplines"
