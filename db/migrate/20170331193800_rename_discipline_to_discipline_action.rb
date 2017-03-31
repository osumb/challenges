class RenameDisciplineToDisciplineAction < ActiveRecord::Migration[5.0]
  def change
    rename_table :disciplines, :discipline_actions
  end
end
