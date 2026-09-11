package view;

import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.JTableHeader;
import java.awt.*;

/**
 * UITheme - Medical Healthcare Design System for Java Swing
 * Provides unified color schemes, typography, borders, and styled components
 * tailored for hospital and clinical practice applications.
 */
public class UITheme {

    // Healthcare Palette
    public static final Color PRIMARY = new Color(30, 58, 138);       // Deep Navy / Medical Blue (#1E3A8A)
    public static final Color PRIMARY_HOVER = new Color(29, 78, 216); // Royal Blue
    public static final Color ACCENT = new Color(37, 99, 235);        // Clinical Blue (#2563EB)
    public static final Color SUCCESS = new Color(5, 150, 105);       // Forest Green (#059669)
    public static final Color DANGER = new Color(220, 38, 38);        // Crimson Red (#DC2626)
    public static final Color WARNING = new Color(217, 119, 6);       // Warm Amber (#D97706)
    public static final Color BG_LIGHT = new Color(248, 250, 252);    // Clinical Off-White (#F8FAFC)
    public static final Color CARD_BG = Color.WHITE;
    public static final Color TEXT_MAIN = new Color(15, 23, 42);      // Slate 900
    public static final Color TEXT_MUTED = new Color(100, 116, 139);  // Slate 500
    public static final Color BORDER = new Color(226, 232, 240);      // Slate 200

    // Typography
    public static final Font FONT_APP_TITLE = new Font("Segoe UI", Font.BOLD, 20);
    public static final Font FONT_TITLE = new Font("Segoe UI", Font.BOLD, 17);
    public static final Font FONT_SUBTITLE = new Font("Segoe UI", Font.BOLD, 13);
    public static final Font FONT_LABEL = new Font("Segoe UI", Font.BOLD, 12);
    public static final Font FONT_BODY = new Font("Segoe UI", Font.PLAIN, 13);
    public static final Font FONT_BUTTON = new Font("Segoe UI", Font.BOLD, 12);

    /**
     * Standard Medical Banner Header with Title and Subtitle
     */
    public static JPanel createHeader(String title, String subtitle) {
        JPanel pnl = new JPanel(new BorderLayout(5, 3));
        pnl.setBackground(PRIMARY);
        pnl.setBorder(new EmptyBorder(14, 20, 14, 20));

        JLabel lblTitle = new JLabel(title);
        lblTitle.setFont(FONT_TITLE);
        lblTitle.setForeground(Color.WHITE);

        JLabel lblSub = new JLabel(subtitle);
        lblSub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblSub.setForeground(new Color(219, 234, 254));

        pnl.add(lblTitle, BorderLayout.NORTH);
        pnl.add(lblSub, BorderLayout.SOUTH);
        return pnl;
    }

    /**
     * Form Header within panels
     */
    public static JPanel createSubHeader(String title) {
        JPanel p = new JPanel(new BorderLayout());
        p.setBackground(new Color(241, 245, 249));
        p.setBorder(new CompoundBorder(
            new LineBorder(BORDER, 1),
            new EmptyBorder(8, 12, 8, 12)
        ));
        JLabel l = new JLabel(title);
        l.setFont(FONT_SUBTITLE);
        l.setForeground(PRIMARY);
        p.add(l, BorderLayout.WEST);
        return p;
    }

    /**
     * Primary action button (e.g., Save, Search, Login)
     */
    public static JButton createPrimaryButton(String text) {
        JButton btn = new JButton(text);
        btn.setFont(FONT_BUTTON);
        btn.setForeground(Color.WHITE);
        btn.setBackground(ACCENT);
        btn.setFocusPainted(false);
        btn.setBorder(new CompoundBorder(new LineBorder(ACCENT, 1), new EmptyBorder(7, 16, 7, 16)));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    /**
     * Success action button (e.g., Register, Complete)
     */
    public static JButton createSuccessButton(String text) {
        JButton btn = new JButton(text);
        btn.setFont(FONT_BUTTON);
        btn.setForeground(Color.WHITE);
        btn.setBackground(SUCCESS);
        btn.setFocusPainted(false);
        btn.setBorder(new CompoundBorder(new LineBorder(SUCCESS, 1), new EmptyBorder(7, 16, 7, 16)));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    /**
     * Secondary / Outline button (e.g., Clear, Reset, Back)
     */
    public static JButton createSecondaryButton(String text) {
        JButton btn = new JButton(text);
        btn.setFont(FONT_BUTTON);
        btn.setForeground(TEXT_MAIN);
        btn.setBackground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setBorder(new CompoundBorder(new LineBorder(BORDER, 1), new EmptyBorder(7, 16, 7, 16)));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    /**
     * Destructive action button (e.g., Delete, Terminate)
     */
    public static JButton createDangerButton(String text) {
        JButton btn = new JButton(text);
        btn.setFont(FONT_BUTTON);
        btn.setForeground(Color.WHITE);
        btn.setBackground(DANGER);
        btn.setFocusPainted(false);
        btn.setBorder(new CompoundBorder(new LineBorder(DANGER, 1), new EmptyBorder(7, 16, 7, 16)));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    /**
     * Applies medical styling to a JTable: customized header, zebra striping, row height
     */
    public static void styleTable(JTable table) {
        table.setRowHeight(30);
        table.setFont(FONT_BODY);
        table.setSelectionBackground(new Color(224, 231, 255));
        table.setSelectionForeground(TEXT_MAIN);
        table.setGridColor(BORDER);
        table.setShowGrid(true);

        JTableHeader header = table.getTableHeader();
        header.setFont(FONT_LABEL);
        header.setBackground(new Color(241, 245, 249));
        header.setForeground(TEXT_MAIN);
        header.setPreferredSize(new Dimension(header.getWidth(), 36));

        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(JLabel.CENTER);
    }

    /**
     * Standard form card panel
     */
    public static JPanel createCard() {
        JPanel p = new JPanel();
        p.setBackground(CARD_BG);
        p.setBorder(new CompoundBorder(
            new LineBorder(BORDER, 1),
            new EmptyBorder(15, 15, 15, 15)
        ));
        return p;
    }
}
