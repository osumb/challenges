desc "Check to see if the challenge list has been exported for a performance and email it"

task email_challenge_list: :environment do
  puts "Checking to see if challenge list should be emailed..."
  p = Performance.last
  if p.nil?
    puts "No performance in the system"
  elsif p.not_open_yet?
    puts "#{p.name} isn't open yet"
  elsif !p.stale?
    puts "#{p.name} isn't closed yet"
  else
    builder = Challenge::ListBuilder.new(p.id)
    builder.build_challenge_list
    stream = builder.write_list_to_buffer
    ChallengeListMailer.challenge_list_email(stream).deliver_now
    p.update!(list_exported: true)
  end
end
