namespace :import do
  desc "TODO"
  task raw_to_json: :environment 
    # json = File.new("#{Rails.root.to_s}/lib/assets/stars.json", 'r')
  # CSV.read["#{Rails.root.to_s}/lib/assets/stars13.dat", { :col_sep => "\t", }].each_with_index do |row, idx|
  
  dataCount = 0
  starIdx = 0
  stars = []
  moment = []
  timeItem = []

  File.open("#{Rails.root.to_s}/lib/assets/stars13.dat").each_with_index do |line,idx|
    # dont index blank lines
    unless line.strip == ""
      # every 14th line is a time index 
      if dataCount % 14 == 0
        #only store an entry after a set has been parsed
        unless starIdx == 0
          stars.push({
            time: timeItem[0],
            timeIdx: timeItem[1],
            data: moment
            })
            starIdx = 0
            moment = []
        end 
        #store the time until coords are parsed
        timeItem = line.chomp.split
      else 
        xyz = line.chomp.split
        # puts xyz[0]
        moment.push({
          id: starIdx,
          x: xyz[0],
          y: xyz[1],
          z: xyz[2]
        })
        starIdx += 1
      end
      dataCount += 1
    end
  end   

  # puts JSON.pretty_generate(stars)

  File.open("#{Rails.root.to_s}/app/assets/data/stars.json", "w") do |file|
    file.puts JSON.pretty_generate(stars)
    # file.puts JSON.generate(stars)
  end

  # File.open(json, 'w') do |f|
  #   f.write(JSON.pretty_generate(stars))
  # end

  # Dir["#{Rails.root.to_s}/lib/assets/stars13.dat"].each_with_index do |line, idx|
  #   puts "#{line}"

  # # File.open(json, 'w') do |f|
  # #   f.write(JSON.encode(bt))
  # # end

  # end

  task raw_to_db: :environment do
  end

end
