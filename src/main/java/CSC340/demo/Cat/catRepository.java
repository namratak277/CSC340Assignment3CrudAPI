package CSC340.demo.Cat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface catRepository extends JpaRepository<cat, Long> {
    List<cat> getCatsByBreed(String breed);

    @Query(value = "Select * from cats c where lower(c.name) like lower(concat('%', ?1, '%'))", nativeQuery = true)
    List<cat> getCatsByName(String name);

    @Query(value = "select * from cats c where lower(c.color) = lower(?1)", nativeQuery = true)
    List<cat> getCatsByColor(String color);
}
