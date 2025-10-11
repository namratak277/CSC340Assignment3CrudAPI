package CSC340.demo.Cat;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class catService {
    @Autowired
    private catRepository catRepository;
   
    public List<cat> getAllCats() {
        return catRepository.findAll();
    }
   
    public Optional<cat> getCatById(Long catId) {
        return catRepository.findById(catId);
    }
   
    public cat addCat(cat cat) {
        return catRepository.save(cat);
    }
    
    public cat updateCat(Long catId, cat updatedCat) {
        return catRepository.findById(catId).map(cat -> {
            cat.setName(updatedCat.getName());
            cat.setDescription(updatedCat.getDescription());
            cat.setBreed(updatedCat.getBreed());
            cat.setAge(updatedCat.getAge());
            cat.setColor(updatedCat.getColor());
            return catRepository.save(cat);
        }).orElse(null);
    }
    
    public void deleteCat(Long catId) {
        catRepository.deleteById(catId);
    }
  
    public List<cat> searchCatsByName(String name) {
        return catRepository.getCatsByName(name);
    }
   
    public List<cat> getCatsByBreed(String breed) {
        return catRepository.getCatsByBreed(breed);
    }

    public List<cat> getCatsByColor(String color) {
        return catRepository.getCatsByColor(color);
    }

    public String writeJson(cat cat) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            objectMapper.writeValue(new File("cats.json"), cat);
            return "Cat written to JSON file successfully";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error writing cat to JSON file";
        }
    }

    public cat readJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(new File("cats.json"), cat.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
