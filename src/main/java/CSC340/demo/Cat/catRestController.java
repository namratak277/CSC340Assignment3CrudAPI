package CSC340.demo.Cat;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cats")
@CrossOrigin(origins = "*")
public class catRestController {
    @Autowired
    private catService catService;

    // Get all cats
    @GetMapping
    public List<cat> getAllCats() {
        return catService.getAllCats();
    }

    // Get cat by ID
    @GetMapping("/{id}")
    public ResponseEntity<cat> getCatById(@PathVariable Long id) {
        Optional<cat> cat = catService.getCatById(id);
        return cat.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Add new cat
    @PostMapping
    public ResponseEntity<cat> addCat(@RequestBody cat cat) {
        cat createdCat = catService.addCat(cat);
        return new ResponseEntity<>(createdCat, HttpStatus.CREATED);
    }

    // Update cat by ID
    @PutMapping("/{id}")
    public ResponseEntity<cat> updateCat(@PathVariable Long id, @RequestBody cat cat) {
        cat updatedCat = catService.updateCat(id, cat);
        if (updatedCat == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(updatedCat);
    }

    // Delete cat by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable Long id) {
        catService.deleteCat(id);
        return ResponseEntity.noContent().build();
    }

    // Search cats by name
    @GetMapping("/search")
    public List<cat> searchCatsByName(@RequestParam(required = false) String name) {
        if (name == null || name.isBlank()) {
            return catService.getAllCats();
        }
        return catService.searchCatsByName(name);
    }

    // Get cats by breed
    @GetMapping("/breed/{breed}")
    public List<cat> getCatsByBreed(@PathVariable String breed) {
        return catService.getCatsByBreed(breed);
    }

    // Get cats by color (added)
    @GetMapping("/color/{color}")
    public List<cat> getCatsByColor(@PathVariable String color) {
        return catService.getCatsByColor(color);
    }
}
