desc 'This task is called by the Heroku scheduler add-on'
task email_challenge_list: :environment do
  puts 'Checking to see if challenge list should be emailed...'
  p = Performance.next
  if p.list_exported
    puts "List for #{p.name} has already been exported"
  else
    begin
      builder = Challenge::ListBuilder.new(p.id)
      builder.build_challenge_list
      location = builder.write_list_to_disk
      ChallengeListMailer.challenge_list_email(location)
      p.update!(list_exported: true)
    rescue => exception
      puts 'Something bad happened!!!!'
      puts exception
    ensure
      puts "Attempted to mail challenge list for #{p.name}"
    end
  end
  puts 'Done.'
end
