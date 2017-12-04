package net.ruixin.util.tools;


import java.io.Closeable;
import java.io.IOException;

public class IOUtils {

    public static void close(Closeable... opens) {
        try {
            for (Closeable open : opens) {
                if (open != null) {
                    open.close();
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("io free fail", e);
        }
    }
}
