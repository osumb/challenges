class ChallengeListMailer < ApplicationMailer
  def challenge_list_email(list_location)
    return if Rails.env.test?
    attachments[list_location.basename.to_s] = File.read(list_location)
    mail(to: ENV['CHALLENGE_LIST_RECIPIENTS'].split(','), subject: 'Challenge List').deliver
  end
end
