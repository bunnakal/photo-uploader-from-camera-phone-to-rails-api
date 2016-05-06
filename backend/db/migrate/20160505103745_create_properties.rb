class CreateProperties < ActiveRecord::Migration
  def change
    create_table :properties do |t|
      t.string :title
      t.text :description
      t.string :latitude
      t.string :longitude

      t.timestamps null: false
    end
  end
end
